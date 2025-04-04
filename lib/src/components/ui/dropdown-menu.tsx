import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "easyleap-flex easyleap-cursor-default easyleap-select-none easyleap-items-center easyleap-gap-2 easyleap-rounded-sm easyleap-px-2 easyleap-py-1.5 easyleap-text-sm easyleap-outline-none focus:easyleap-bg-[#454545] data-[state=open]:easyleap-bg-[#454545] [&_svg]:easyleap-pointer-events-none [&_svg]:easyleap-size-4 [&_svg]:easyleap-shrink-0",
      inset && "easyleap-pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "easyleap-z-50 easyleap-min-w-[8rem] easyleap-overflow-hidden easyleap-rounded-md easyleap-border easyleap-bg-white easyleap-p-1 easyleap-text-[#0A0A0A] easyleap-shadow-lg data-[state=open]:easyleap-animate-in data-[state=closed]:easyleap-animate-out data-[state=closed]:easyleap-fade-out-0 data-[state=open]:easyleap-fade-in-0 data-[state=closed]:easyleap-zoom-out-95 data-[state=open]:easyleap-zoom-in-95 data-[side=bottom]:easyleap-slide-in-from-top-2 data-[side=left]:easyleap-slide-in-from-right-2 data-[side=right]:easyleap-slide-in-from-left-2 data-[side=top]:easyleap-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "easyleap-z-50 easyleap-min-w-[8rem] easyleap-overflow-hidden easyleap-rounded-md easyleap-border easyleap-bg- easyleap-p-1 easyleap-text-[#0A0A0A] easyleap-shadow-md",
        "data-[state=open]:easyleap-animate-in data-[state=closed]:easyleap-animate-out data-[state=closed]:easyleap-fade-out-0 data-[state=open]:easyleap-fade-in-0 data-[state=closed]:easyleap-zoom-out-95 data-[state=open]:easyleap-zoom-in-95 data-[side=bottom]:easyleap-slide-in-from-top-2 data-[side=left]:easyleap-slide-in-from-right-2 data-[side=right]:easyleap-slide-in-from-left-2 data-[side=top]:easyleap-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "easyleap-relative easyleap-flex easyleap-cursor-default easyleap-select-none easyleap-items-center easyleap-gap-2 easyleap-rounded-sm easyleap-px-2 easyleap-py-1.5 easyleap-text-sm easyleap-outline-none easyleap-transition-colors focus:easyleap-bg-[#454545] focus:easyleap-text-[#1A1A1A] data-[disabled]:easyleap-pointer-events-none data-[disabled]:easyleap-opacity-50 [&>svg]:easyleap-size-4 [&>svg]:easyleap-shrink-0",
      inset && "easyleap-pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "easyleap-relative easyleap-flex easyleap-cursor-default easyleap-select-none easyleap-items-center easyleap-rounded-sm easyleap-py-1.5 easyleap-pl-8 easyleap-pr-2 easyleap-text-sm easyleap-outline-none easyleap-transition-colors focus:easyleap-bg-[#454545] focus:easyleap-text-[#1A1A1A] data-[disabled]:easyleap-pointer-events-none data-[disabled]:easyleap-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="easyleap-absolute easyleap-left-2 easyleap-flex easyleap-h-3.5 easyleap-w-3.5 easyleap-items-center easyleap-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="easyleap-h-4 easyleap-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "easyleap-relative easyleap-flex easyleap-cursor-default easyleap-select-none easyleap-items-center easyleap-rounded-sm easyleap-py-1.5 easyleap-pl-8 easyleap-pr-2 easyleap-text-sm easyleap-outline-none easyleap-transition-colors focus:easyleap-bg-[#454545] focus:easyleap-text-[#1A1A1A] data-[disabled]:easyleap-pointer-events-none data-[disabled]:easyleap-opacity-50",
      className
    )}
    {...props}
  >
    <span className="easyleap-absolute easyleap-left-2 easyleap-flex easyleap-h-3.5 easyleap-w-3.5 easyleap-items-center easyleap-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="easyleap-h-2 easyleap-w-2 easyleap-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "easyleap-px-2 easyleap-py-1.5 easyleap-text-sm easyleap-font-semibold",
      inset && "easyleap-pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "easyleap-mx-1 easyleap-my-1 easyleap-h-px easyleap-bg-[#F5F5F6]",
      className
    )}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "easyleap-ml-auto easyleap-text-xs easyleap-tracking-widest easyleap-opacity-60",
        className
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
};
