import {Slider, SliderChangeEvent} from 'primereact/slider';
import {useState} from "react";
import {InputText} from "primereact/inputtext";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const BrightnessController = () => {
    const [value, setValue] = useState(10);

    return (
        <div className="card flex justify-content-center">
            <InputText
                type="number"
                min={0}
                max={100}
                value={value.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const v = Number(e.target.value);
                    if (!Number.isNaN(v)) setValue(clamp(v, 0, 100));
                }}
                style={{ width: "100%", marginBottom: 10 }}
            />
            <div className="w-14rem">
                <Slider
                    value={value}
                    onChange={(e: SliderChangeEvent) => setValue(e.value)}
                    className="w-full"
                    max={100}
                />
            </div>
        </div>
    );
}

export default BrightnessController;