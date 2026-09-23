import PropTypes from "prop-types";
import MainTitleAndDesForm from "../mainTitleAndDescriptionForm/MainTitleAndDesForm";
import HeaderBannerCard from "./HeaderBannerCard";
import FormSectionItem from "./FormSectionItem";
import useCardDragReorder from "./useCardDragReorder";

const FormSectionList = ({
	activeSection,
	onSectionClick,
	sectionRefs,
	register,
	control,
	setValue,
	fields,
	headerImage,
	onHeaderImageChange,
	onDeleteField,
	onDuplicateField,
	onMoveField,
}) => {
	const { dragCardState, handlePointerDownCardDrag, getCardStyle } = useCardDragReorder({
		fields,
		sectionRefs,
		onMoveField,
		onSectionClick,
	});

	return (
		<div className="flex flex-col gap-3">
			{/* Standalone Separated Header Banner Card if present */}
			<HeaderBannerCard headerImage={headerImage} onHeaderImageChange={onHeaderImageChange} />

			{/* Main Title Form - Always present, Index 0 */}
			<div
				ref={(el) => (sectionRefs.current[0] = el)}
				onClick={() => onSectionClick(0)}
				onFocusCapture={() => onSectionClick(0)}
			>
				<MainTitleAndDesForm
					activeElement={activeSection === 0}
					register={register}
					control={control}
					setValue={setValue}
				/>
			</div>

			{/* Dynamic Question / Title / Image Fields */}
			{fields.map((field, index) => {
				const realIndex = index + 1;
				const isCurrentDragged = dragCardState.isDragging && dragCardState.dragIdx === index;

				return (
					<FormSectionItem
						key={field.id}
						field={field}
						index={index}
						realIndex={realIndex}
						isActive={activeSection === realIndex}
						isCurrentDragged={isCurrentDragged}
						cardStyle={getCardStyle(index)}
						sectionRef={(el) => (sectionRefs.current[realIndex] = el)}
						onSectionClick={onSectionClick}
						onDeleteField={onDeleteField}
						onDuplicateField={onDuplicateField}
						onPointerDownDrag={handlePointerDownCardDrag}
						register={register}
						control={control}
						setValue={setValue}
					/>
				);
			})}
		</div>
	);
};

FormSectionList.propTypes = {
	activeSection: PropTypes.number.isRequired,
	onSectionClick: PropTypes.func.isRequired,
	sectionRefs: PropTypes.object.isRequired,
	register: PropTypes.func.isRequired,
	control: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	fields: PropTypes.array.isRequired,
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	onDeleteField: PropTypes.func.isRequired,
	onDuplicateField: PropTypes.func,
	onMoveField: PropTypes.func,
};

export default FormSectionList;
