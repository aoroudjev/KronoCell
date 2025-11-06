import { useState } from "react";
import NumericSliderControl from "./NumericSliderControl";

export default function BrightnessController() {
    const [brightness, setBrightness] = useState(10);

    return (
        <NumericSliderControl
            name="brightness"
            label="Brightness"
            value={brightness}
            onChange={(v) => setBrightness(v)}
            min={0}
            max={100}
            step={1}
            format={(n) => Math.round(n).toString()}
        />
    );
}
