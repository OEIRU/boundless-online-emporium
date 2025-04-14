
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Security check to ensure defaultValue and value are valid
  // This prevents potential injection attacks via props
  const safeProps = React.useMemo(() => {
    const result = { ...props };
    
    // Ensure numeric values for range inputs
    if (result.value !== undefined) {
      if (Array.isArray(result.value)) {
        result.value = result.value.map(v => 
          typeof v === 'number' && !isNaN(v) ? v : 0
        );
      } else if (typeof result.value === 'number' && isNaN(result.value)) {
        result.value = 0;
      }
    }
    
    if (result.defaultValue !== undefined) {
      if (Array.isArray(result.defaultValue)) {
        result.defaultValue = result.defaultValue.map(v => 
          typeof v === 'number' && !isNaN(v) ? v : 0
        );
      } else if (typeof result.defaultValue === 'number' && isNaN(result.defaultValue)) {
        result.defaultValue = 0;
      }
    }
    
    // Ensure min and max are valid numbers
    if (result.min !== undefined && (typeof result.min !== 'number' || isNaN(result.min))) {
      result.min = 0;
    }
    
    if (result.max !== undefined && (typeof result.max !== 'number' || isNaN(result.max))) {
      result.max = 100;
    }
    
    return result;
  }, [props]);
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...safeProps}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-store-purple" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-store-purple bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      {safeProps.value && Array.isArray(safeProps.value) && safeProps.value.length > 1 && (
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-store-purple bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      )}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
