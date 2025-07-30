import { forwardRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import type { OverlayPanelProps } from "../types";

const RowSelectorOverlay = forwardRef<OverlayPanel, OverlayPanelProps>(
  ({ onSubmit, selectedItems, rowsPerPage, setSelectedItems }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isInputValid = inputValue.trim() !== "" && Number(inputValue) >= 1;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      if (val === "" || Number(val) < 1) {
        setInputError("Please enter a number greater than or equal to 1");
      } else {
        setInputError("");
      }
    };

    const handleSubmit = async () => {
      const count = Number(inputValue);
      if (!isInputValid) return;

      setIsLoading(true);
      try {
        await onSubmit(count, selectedItems, rowsPerPage, setSelectedItems);
        setInputValue("");

        if (ref && typeof ref !== "function") {
          ref.current?.hide();
        }
      } catch (err) {
        console.error("Bulk select error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <OverlayPanel
        ref={ref}
        onHide={() => {
          setInputValue("");
          setInputError("");
          setIsLoading(false);
        }}
        style={{ width: "100%", maxWidth: "260px" }}
        className="w-[90vw] sm:w-64 md:w-72"
      >
        <div className="p-3 flex flex-col gap-2 w-full">
          <InputText
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Select rows..."
            min={1}
            className={classNames({ "p-invalid": inputError })}
          />
          {inputError && <small className="text-red-500">{inputError}</small>}
          <div className="flex justify-end">
            <Button
              label={
                isLoading
                  ? "Selecting..."
                  : inputValue && Number(inputValue) >= 1
                  ? `Select ${inputValue} row${
                      Number(inputValue) > 1 ? "s" : ""
                    }`
                  : "Submit"
              }
              onClick={handleSubmit}
              disabled={!isInputValid || isLoading}
              icon={isLoading ? "pi pi-spin pi-spinner" : undefined}
            />
          </div>
        </div>
      </OverlayPanel>
    );
  }
);

export type RowSelectorOverlayRef = OverlayPanel;
export default RowSelectorOverlay;
