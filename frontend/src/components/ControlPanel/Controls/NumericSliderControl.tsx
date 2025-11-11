import React, {useCallback, useMemo, useState} from "react";
import {Slider, SliderChangeEvent} from "primereact/slider";
import {InputText} from "primereact/inputtext";

type ChangeSource = "input" | "slider" | "reset";
type OnChangeMeta = { name?: string; source: ChangeSource };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export type NumericSliderControlProps = {
    /** Optional unique name/id for forms and event meta */
    name?: string;
    /** Visible label above the control (optional) */
    label?: string;
    /** Controlled value */
    value?: number;
    /** Uncontrolled initial value (used if `value` is undefined) */
    defaultValue?: number;

    /** Called whenever the value changes */
    onChange?: (nextValue: number, meta: OnChangeMeta) => void;

    /** Slider/Input bounds and step */
    min?: number;
    max?: number;
    step?: number;

    /** Format the input display value. Defaults to identity. */
    format?: (n: number) => string;
    /** Parse the input text to a number. Defaults to Number(...) */
    parse?: (s: string) => number;

    /** Disable the control */
    disabled?: boolean;

    /** Extra classes */
    className?: string;

    /** Extra props forwarded to InputText (except value/onChange/type/min/max) */
    inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "min" | "max">;

    /** Extra props forwarded to Slider (except value/onChange/min/max/step) */
    sliderProps?: Record<string, unknown>;
};

export default function NumericSliderControl({
                                                 name,
                                                 label,
                                                 value,
                                                 defaultValue,
                                                 onChange,
                                                 min = 0,
                                                 max = 100,
                                                 step = 1,
                                                 format = (n) => String(n),
                                                 parse = (s) => Number(s),
                                                 disabled = false,
                                                 className,
                                                 inputProps,
                                                 sliderProps
                                             }: NumericSliderControlProps) {
    const isControlled = value !== undefined;

    // Internal state for uncontrolled usage
    const [inner, setInner] = useState<number>(defaultValue ?? min);
    const current = isControlled ? (value as number) : inner;

    const setValue = useCallback(
        (next: number, source: ChangeSource) => {
            const clamped = clamp(next, min, max);
            if (!isControlled) setInner(clamped);
            onChange?.(clamped, {name, source});
        },
        [isControlled, min, max, onChange, name]
    );

    const inputId = useMemo(
        () => (name ? `nsc-${name}` : undefined),
        [name]
    );

    return (
        <div className={["card flex flex-column gap-2", className].filter(Boolean).join(" ")}>
            {label && (
                <label htmlFor={inputId} className="font-semibold mb-1">
                    {label}
                </label>
            )}

            <InputText
                id={inputId}
                type="number"
                inputMode="decimal"
                min={min}
                max={max}
                step={step}
                value={format(current)}
                disabled={disabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const raw = e.target.value;
                    const parsed = parse(raw);
                    if (!Number.isNaN(parsed)) {
                        setValue(parsed, "input");
                    }
                }}
                style={{width: "100%"}}
                {...inputProps}
            />

            <div className="w-14rem">
                <Slider
                    value={current}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e: SliderChangeEvent) => {
                        // PrimeReact's e.value can be number | number[]; we’re single-value
                        setValue((e.value as number) ?? current, "slider");
                    }}
                    disabled={disabled}
                    className="w-full"
                    {...sliderProps}
                />
            </div>
        </div>
    );
}
