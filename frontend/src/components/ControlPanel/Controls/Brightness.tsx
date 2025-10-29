import {Slider, SliderChangeEvent} from 'primereact/slider';
import {useState} from "react";
import {InputText} from "primereact/inputtext";


const BrightnessController = () => {
    const [value, setValue] = useState(10);

    return (
        <div className="card flex justify-content-center">
            <div className="w-14rem">
                <InputText
                    value={value.toString()}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full"
                />
                <Slider
                    value={value}
                    onChange={(e: SliderChangeEvent) => setValue(e.value)}
                    className="w-full"
                    max={20}
                />
            </div>
        </div>
    );
}

export default BrightnessController;