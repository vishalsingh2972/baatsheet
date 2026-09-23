import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";
import OptionItem from "./OptionItem";
import OtherOptionItem from "./OtherOptionItem";
import AddOptionRow from "./AddOptionRow";
import { useGenerateOptionsWithAIMutation } from "../../../../redux/api/formApi";

const RenderOptionWithIcon = ({
	icon,
	activeElement = true,
	control,
	setValue,
	index,
	onOptionFocus,
}) => {
	const [selected, setSelected] = useState(null);
	const [hoverIdx, setHoverIdx] = useState(null);
	const [generateOptionsWithAI, { isLoading: isGeneratingOptions }] =
		useGenerateOptionsWithAIMutation();

	const [dragState, setDragState] = useState({
		isDragging: false,
		dragIdx: null,
		dragY: 0,
		targetIdx: null,
	});

	const dragStateRef = useRef(dragState);
	dragStateRef.current = dragState;

	const startYRef = useRef(0);

	const watchedOptions = useWatch({
		control,
		name: `items.${index}.options`,
		defaultValue: ["Option 1"],
	});

	const questionTitle = useWatch({
		control,
		name: `items.${index}.questionTitle`,
		defaultValue: "Untitled Question",
	});

	const questionType = useWatch({
		control,
		name: `items.${index}.questionType`,
		defaultValue: "multiplechoice",
	});

	const options =
		Array.isArray(watchedOptions) && watchedOptions.length > 0
			? watchedOptions
			: ["Option 1"];

	const hasOther = options.some(
		(opt) => opt === "__OTHER__" || opt === "Other..."
	);

	const normalOptionsCount = options.filter(
		(opt) => opt !== "__OTHER__" && opt !== "Other..."
	).length;

	const handleSuggestWithAI = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			const res = await generateOptionsWithAI({
				questionTitle: questionTitle || "Untitled Question",
				questionType: questionType || "multiplechoice",
			}).unwrap();

			const suggested = res?.data?.options || res?.options;
			if (Array.isArray(suggested) && suggested.length > 0) {
				const finalOptions = hasOther
					? [...suggested, "__OTHER__"]
					: suggested;
				setValue?.(`items.${index}.options`, finalOptions, {
					shouldDirty: true,
				});
				onOptionFocus?.();
			}
		} catch (err) {
			console.error("Failed to generate options with AI:", err);
		}
	};

	const handleOptionChange = (optIdx, newVal) => {
		const updated = [...options];
		updated[optIdx] = newVal;
		setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
	};

	const handleAddOption = (e) => {
		e.preventDefault();
		e.stopPropagation();

		let updated;
		if (hasOther) {
			const otherIdx = options.findIndex(
				(opt) => opt === "__OTHER__" || opt === "Other..."
			);
			const normalCount = options.filter(
				(opt) => opt !== "__OTHER__" && opt !== "Other..."
			).length;
			updated = [
				...options.slice(0, otherIdx),
				`Option ${normalCount + 1}`,
				...options.slice(otherIdx),
			];
			setSelected(otherIdx);
		} else {
			updated = [...options, `Option ${options.length + 1}`];
			setSelected(options.length);
		}

		setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
		onOptionFocus?.();
	};

	const handleAddOther = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (hasOther) return;

		const updated = [...options, "__OTHER__"];
		setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
		onOptionFocus?.();
	};

	const handleRemoveOption = (e, optIdx) => {
		e.preventDefault();
		e.stopPropagation();
		if (options.length > 1) {
			const updated = options.filter((_, i) => i !== optIdx);
			setValue?.(`items.${index}.options`, updated, { shouldDirty: true });
		}
	};

	// Pointer Drag Reordering Engine
	const handlePointerDownDrag = (e, optIdx) => {
		e.preventDefault();
		e.stopPropagation();

		startYRef.current = e.clientY;
		setDragState({
			isDragging: true,
			dragIdx: optIdx,
			dragY: 0,
			targetIdx: optIdx,
		});

		const handlePointerMove = (moveEvent) => {
			const deltaY = moveEvent.clientY - startYRef.current;
			const rowHeight = 36;
			const newTarget = Math.max(
				0,
				Math.min(
					normalOptionsCount - 1,
					Math.round(optIdx + deltaY / rowHeight)
				)
			);

			setDragState((prev) => ({
				...prev,
				dragY: deltaY,
				targetIdx: newTarget,
			}));
		};

		const handlePointerUp = () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);

			const currentDrag = dragStateRef.current;
			if (
				currentDrag.isDragging &&
				currentDrag.targetIdx !== null &&
				currentDrag.dragIdx !== null &&
				currentDrag.targetIdx !== currentDrag.dragIdx
			) {
				const updated = [...options];
				const [movedItem] = updated.splice(currentDrag.dragIdx, 1);
				updated.splice(currentDrag.targetIdx, 0, movedItem);
				setValue?.(`items.${index}.options`, updated, {
					shouldDirty: true,
				});
			}

			setDragState({
				isDragging: false,
				dragIdx: null,
				dragY: 0,
				targetIdx: null,
			});
		};

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);
	};

	useEffect(() => {
		return () => {
			setDragState({
				isDragging: false,
				dragIdx: null,
				dragY: 0,
				targetIdx: null,
			});
		};
	}, []);

	return (
		<div className="mt-2 flex flex-col gap-1">
			{options.map((optionText, optIdx) => {
				const isOther =
					optionText === "__OTHER__" || optionText === "Other...";

				if (isOther) {
					return (
						<OtherOptionItem
							key={`other_${optIdx}`}
							icon={icon}
							activeElement={activeElement}
							isHover={hoverIdx === optIdx}
							onMouseEnter={() => setHoverIdx(optIdx)}
							onMouseLeave={() => setHoverIdx(null)}
							onRemove={(e) => handleRemoveOption(e, optIdx)}
						/>
					);
				}

				// Calculate smooth shifting for adjacent items during drag
				let dragStyle = {};
				const isCurrentDragged =
					dragState.isDragging && dragState.dragIdx === optIdx;

				if (isCurrentDragged) {
					dragStyle = {
						transform: `translateY(${dragState.dragY}px)`,
						zIndex: 40,
						transition: "none",
					};
				} else if (dragState.isDragging) {
					const { dragIdx, targetIdx } = dragState;
					if (dragIdx < targetIdx && optIdx > dragIdx && optIdx <= targetIdx) {
						dragStyle = {
							transform: "translateY(-36px)",
							transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
						};
					} else if (
						dragIdx > targetIdx &&
						optIdx < dragIdx &&
						optIdx >= targetIdx
					) {
						dragStyle = {
							transform: "translateY(36px)",
							transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
						};
					} else {
						dragStyle = {
							transform: "translateY(0px)",
							transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
						};
					}
				}

				return (
					<OptionItem
						key={`opt_${optIdx}`}
						icon={icon}
						optionText={optionText}
						optIdx={optIdx}
						totalOptions={options.length}
						activeElement={activeElement}
						isSelected={selected === optIdx}
						isHover={hoverIdx === optIdx}
						isDragging={isCurrentDragged}
						dragStyle={dragStyle}
						onMouseEnter={() => setHoverIdx(optIdx)}
						onMouseLeave={() => setHoverIdx(null)}
						onFocus={(e) => {
							setSelected(optIdx);
							onOptionFocus?.();
							e.target.select();
						}}
						onBlur={() => setSelected(null)}
						onClick={(e) => {
							e.stopPropagation();
							setSelected(optIdx);
							onOptionFocus?.();
						}}
						onChange={(val) => handleOptionChange(optIdx, val)}
						onRemove={(e) => handleRemoveOption(e, optIdx)}
						onPointerDownDrag={handlePointerDownDrag}
					/>
				);
			})}

			{activeElement && (
				<AddOptionRow
					icon={icon}
					hasOther={hasOther}
					onAddOption={handleAddOption}
					onAddOther={handleAddOther}
					onSuggestWithAI={handleSuggestWithAI}
					isGeneratingOptions={isGeneratingOptions}
				/>
			)}
		</div>
	);
};

RenderOptionWithIcon.propTypes = {
	icon: PropTypes.node.isRequired,
	activeElement: PropTypes.bool,
	control: PropTypes.object,
	register: PropTypes.func,
	setValue: PropTypes.func,
	index: PropTypes.number.isRequired,
	onOptionFocus: PropTypes.func,
};

export default RenderOptionWithIcon;
