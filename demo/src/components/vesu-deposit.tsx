"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Call, CallData } from "starknet";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { DestinationDapp, ReviewModal, TokenTransfer } from "@easyleap/sdk";

import { InteractionMode, useSharedState } from "@easyleap/sdk";
import { useAccount } from "@easyleap/sdk";
import { useAmountOut } from "@easyleap/sdk";
import { useBalance } from "@easyleap/sdk";
import { useMode } from "@easyleap/sdk";
import { useSendTransaction } from "@easyleap/sdk";
import { ADDRESSES } from "@easyleap/sdk";

import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formSchema = z.object({
  depositAmount: z.string().refine(
    (v) => {
      const n = Number(v);
      return !isNaN(n) && v?.length > 0 && n > 0;
    },
    { message: "Invalid input" }
  )
});

export type FormValues = z.infer<typeof formSchema>;

const VesuDeposit: React.FC = () => {
  const { addressSource, addressDestination } = useAccount();

  const sharedState = useSharedState();

  const balanceInfo = useBalance({
    l2TokenAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      depositAmount: ""
    },
    mode: "onChange"
  });

  const rawAmount = React.useMemo(() => {
    return BigInt(
      Math.round(Number(form.getValues("depositAmount")) * 1e18).toFixed(0)
    );
  }, [form.getValues("depositAmount")]);

  const amountOutRes = useAmountOut(rawAmount);

  const handleQuickDepositPrice = (percentage: number) => {
    if (!addressDestination) {
      return toast({
        description: (
          <div className="flex items-center gap-2">
            <Info className="size-5" />
            Please connect your wallet
          </div>
        )
      });
    }

    if (balanceInfo?.data?.formatted && percentage === 100) {
      if (Number(balanceInfo?.data?.formatted) < 1) {
        form.setValue("depositAmount", "0");
        form.clearErrors("depositAmount");
        return;
      }
      form.setValue(
        "depositAmount",
        (Number(balanceInfo?.data?.formatted) - 1).toString()
      );
      form.clearErrors("depositAmount");
      return;
    }
    if (balanceInfo?.data) {
      form.setValue(
        "depositAmount",
        ((Number(balanceInfo?.data?.formatted) * percentage) / 100).toString()
      );
      form.clearErrors("depositAmount");
    }
  };

  const mode = useMode();

  const calls = useMemo(() => {
    return getCalls(amountOutRes.amountOut, addressDestination, mode);
  }, [amountOutRes, amountOutRes.amountOut, addressDestination, mode]);

  const {
    send,
    error,
    isPending,
    dataSN,
    dataEVM: _,
    isSuccessSN,
    isSuccessEVM
  } = useSendTransaction({
    calls: calls,
    bridgeConfig: {
      // ! This is L2 ETH address. Dont change
      l2_token_address:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      amount: rawAmount
    }
  });

  React.useEffect(() => {
    console.log("useSendTransaction error", error);

    (async () => {
      if (isPending) {
        toast({
          description: (
            <div className="flex items-center gap-2 font-semibold">
              <Info className="size-5" />
              Transaction pending...
            </div>
          )
        });
      }

      if (error && error.message.toLowerCase().includes("user rejected")) {
        toast({
          description: (
            <div className="flex items-center gap-2 font-semibold">
              <Info className="size-5" />
              Transaction declined!
            </div>
          )
        });
      } else if (error) {
        toast({
          description: (
            <div className="flex items-center gap-2 font-semibold">
              <Info className="size-5" />
              {error.message}
            </div>
          )
        });
      }

      if (dataSN?.transaction_hash) {
        toast({
          itemID: "stake",
          variant: "complete",
          duration: 3000,
          description: (
            <div className="flex items-center gap-2 bg-[#b5abdf] text-[#1C182B]">
              <div className="flex flex-col items-start gap-2 text-sm font-medium">
                <span className="text-[18px] font-semibold">Success 🎉</span>
                Deposited {form.getValues("depositAmount")} ETH
              </div>
            </div>
          )
        });
        form.reset();
      }

      if (isSuccessEVM) {
        toast({
          itemID: "stake",
          variant: "complete",
          duration: 3000,
          description: (
            <div className="flex items-center gap-2 bg-[#b5abdf] text-[#1C182B]">
              <div className="flex flex-col items-start gap-2 text-sm font-medium">
                <span className="text-[18px] font-semibold">Success 🎉</span>
                Bridge transaction sent 🚀
              </div>
            </div>
          )
        });
        form.reset();
      }
    })();
  }, [dataSN, error, form, isPending, isSuccessEVM, isSuccessSN]);

  // Deposit calls
  const tokensOut: TokenTransfer[] = React.useMemo(() => {
    return [
      {
        name: "ETH",
        amount: (Number(rawAmount) / 1e18).toFixed(4),
        logo: "https://app.strkfarm.com/zklend/icons/tokens/eth.svg?w=20"
      }
    ];
  }, [rawAmount]);

  const tokensIn: TokenTransfer[] = React.useMemo(() => {
    return [
      {
        name: "vETH",
        amount: (Number(amountOutRes.amountOut) / 1e18).toFixed(4),
        logo: "https://app.strkfarm.com/zklend/icons/tokens/eth.svg?w=20"
      }
    ];
  }, [amountOutRes.amountOut]);

  const destinationDapp: DestinationDapp = {
    name: "Vesu",
    logo: "https://app.vesu.xyz/favicon.ico"
  };

  const onSubmit = async (values: FormValues) => {
    if (Number(values.depositAmount) > Number(balanceInfo?.data?.formatted)) {
      return toast({
        description: (
          <div className="flex items-center gap-2">
            <Info className="size-5" />
            Insufficient balance
          </div>
        )
      });
    }

    send(tokensIn, tokensOut, destinationDapp);
  };

  return (
    <div className="w-full pb-5 md:pb-0">
      <ReviewModal />

      <h2 className="bg-gradient-to-r from-[#FFFFFF] to-[#EC796B] bg-clip-text text-center text-[32px] font-extrabold leading-[38.4px] text-transparent">
        Try it
      </h2>

      <div className="mt-8 flex w-full flex-col items-start rounded-lg border border-[#675E99] bg-[#1C182B] px-4 py-3 shadow-lg md:px-12 md:py-10 lg:gap-2">
        <div className="flex flex-1 flex-col items-center">
          <p className="text-center text-sm font-medium text-[#DADADA] md:text-lg">
            Perform a one-step ETH deposit from L1 using Bridge <br />
            Mode or directly on Starknet.
          </p>

          <div className="mt-7 flex w-full flex-col items-start gap-2">
            <span className="text-xs text-[#EDDFFDCC]">dapp</span>
            <div className="w-full rounded-md border border-[#B9AFF133] bg-[#B9AFF10D] p-2 px-5 font-normal text-[#EDDFFDCC]">
              <Icons.vesuNamedLogo className="" />
            </div>
          </div>

          <div className="mt-5 w-full rounded-lg border border-[#B9AFF133] bg-[#B9AFF108] p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full gap-2"
              >
                <FormField
                  control={form.control}
                  name="depositAmount"
                  render={({ field }) => (
                    <FormItem className="relative w-full space-y-0">
                      <FormLabel className="text-xs text-[#EDDFFDCC]">
                        Enter Amount
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-fit border-none px-0 pr-1 text-2xl text-white shadow-none outline-none placeholder:text-white/70 focus-visible:ring-0 lg:pr-0 lg:!text-3xl"
                          placeholder="0.123"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-4 left-0 text-xs lg:left-1" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-end gap-0.5 text-xs font-medium text-white/60 lg:text-sm">
                  <div className="mt-1.5 flex flex-row-reverse items-center gap-1 text-[#EDDFFD]">
                    <span className="text-start">Balance</span>
                    <Icons.wallet className="size-3" />
                  </div>
                  <span className="text-xs font-extrabold text-[#C078FF] md:text-sm">
                    {balanceInfo?.data?.formatted
                      ? Number(balanceInfo?.data?.formatted).toFixed(2)
                      : "0"}{" "}
                    ETH
                  </span>
                </div>
              </form>
            </Form>

            <div className="mt-7 hidden w-full items-center text-white/80 lg:flex">
              <button
                onClick={() => handleQuickDepositPrice(25)}
                className="w-full rounded-md rounded-r-none border border-r-0 border-[#B9AFF133] bg-[#B9AFF10D] px-2 py-1 text-sm font-normal text-[#EDDFFDCC] hover:bg-[#B9AFF126] hover:text-white"
              >
                25%
              </button>

              <button
                onClick={() => handleQuickDepositPrice(50)}
                className="w-full rounded-md rounded-l-none rounded-r-none border border-r-0 border-[#B9AFF133] bg-[#B9AFF10D] px-2 py-1 text-sm font-normal text-[#EDDFFDCC] hover:bg-[#B9AFF126] hover:text-white"
              >
                50%
              </button>

              <button
                onClick={() => handleQuickDepositPrice(75)}
                className="w-full rounded-md rounded-l-none rounded-r-none border border-r-0 border-[#B9AFF133] bg-[#B9AFF10D] px-2 py-1 text-sm font-normal text-[#EDDFFDCC] hover:bg-[#B9AFF126] hover:text-white"
              >
                75%
              </button>

              <button
                onClick={() => handleQuickDepositPrice(100)}
                className="w-full rounded-md rounded-l-none border border-[#B9AFF133] bg-[#B9AFF10D] px-2 py-1 text-sm font-normal text-[#EDDFFDCC] hover:bg-[#B9AFF126] hover:text-white"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          {addressDestination || addressSource ? (
            <Button
              type="submit"
              disabled={
                Number(form.getValues("depositAmount")) <= 0 ||
                isNaN(Number(form.getValues("depositAmount")))
                  ? true
                  : false
              }
              onClick={form.handleSubmit(onSubmit)}
              style={{
                background:
                  "linear-gradient(180deg, #7151EB 0%, #C078FF 100%), radial-gradient(29.19% 139.29% at 51.96% 8.93%, #80A6FC 0%, rgba(113, 81, 235, 0) 100%)"
              }}
              className="h-11 w-full rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            >
              Deposit
            </Button>
          ) : (
            <Button
              style={{
                background:
                  "linear-gradient(180deg, #7151EB 0%, #C078FF 100%), radial-gradient(29.19% 139.29% at 51.96% 8.93%, #80A6FC 0%, rgba(113, 81, 235, 0) 100%)"
              }}
              className="h-11 w-full rounded-2xl text-sm font-semibold text-white"
              onClick={() => sharedState.setConnectWalletModalOpen(true)}
            >
              Connect Wallet
            </Button>
          )}
        </div>
        <small className="text-[grey]">
          We chose Vesu because it's active on Sepolia and supports ETH
          deposits.
        </small>
        <small className="text-[grey]">
          It's used only for demo purposes and the SDK will work with any dApp.
        </small>

        {/* <div className="text-[grey]">
          Amount you get: {(Number(amountOutRes.amountOut) / 1e18).toFixed(8)}{" "}
          ETH
        </div>
        <div className="text-[grey]">
          Service Fee: {(Number(amountOutRes.fee) / 1e18).toFixed(8)} ETH
        </div> */}
      </div>
    </div>
  );
};

export default VesuDeposit;

function getCalls(
  postBridgeFeeAmount: bigint,
  user: string | undefined,
  mode: InteractionMode
): Call[] {
  if (!user) {
    return [];
  }
  const SEPOLIA_SN_ETH =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
  const SEPOLIA_VESU_ETH =
    "0x07809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3";
  const SEPOLIA_vETH =
    "0x01ceb6db3ac889e2c0d2881eff602117c340316e55436f37699d91c193ee8aa0";

  const call1: Call = {
    contractAddress: SEPOLIA_SN_ETH,
    entrypoint: "transfer",
    // receiver is some random address to simulate spend of bridged ETH
    calldata: CallData.compile([
      "0x01BAe0e3cd91E0096bF2283d98390Bd29579B39C93964C1D2a3EEC8d5cf51C61",
      postBridgeFeeAmount,
      0
    ])
  };

  const call2: Call = {
    contractAddress: SEPOLIA_VESU_ETH,
    entrypoint: "mint",
    // actually no need to use executor anyway, just using for this hacky demo
    // cause vesu supported ETH and bridge ETH are different
    calldata: CallData.compile([
      mode == InteractionMode.Bridge ? ADDRESSES.STARKNET.EXECUTOR : user,
      postBridgeFeeAmount,
      0
    ])
  };

  const call3: Call = {
    contractAddress: SEPOLIA_VESU_ETH,
    entrypoint: "approve",
    calldata: CallData.compile([SEPOLIA_vETH, postBridgeFeeAmount, 0])
  };

  const call4: Call = {
    contractAddress: SEPOLIA_vETH,
    entrypoint: "deposit",
    calldata: CallData.compile([postBridgeFeeAmount, 0, user])
  };

  return [call1, call2, call3, call4];
}
