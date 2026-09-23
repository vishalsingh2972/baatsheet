import PropTypes from "prop-types";
import UserEditForm from "../userEditForm/UserEditForm";
import TitleAndDesForm from "../generalTitleAndDescriptionForm/TitleAndDesForm";
import ImageSectionForm from "../imageSectionForm/ImageSectionForm";

const FormSectionItem = ({
	field,
	index,
	realIndex,
	isActive,
	isCurrentDragged,
	cardStyle,
	sectionRef,
	onSectionClick,
	onDeleteField,
	onDuplicateField,
	onPointerDownDrag,
	register,
	control,
	setValue,
}) => {
	return (
		<div
			ref={sectionRef}
			onClick={() => onSectionClick(realIndex)}
			onFocusCapture={() => onSectionClick(realIndex)}
			style={cardStyle}
			className={`relative transition-shadow duration-200 ${
				isCurrentDragged
					? "shadow-[0_16px_36px_rgba(0,0,0,0.14),0_4px_10px_rgba(0,0,0,0.06)] z-50 rounded-lg scale-[1.015] border-purple-200"
					: ""
			}`}
		>
			{field.type === "question" && (
				<UserEditForm
					activeElement={isActive}
					onDelete={() => onDeleteField(index)}
					onDuplicate={() => onDuplicateField?.(index)}
					onPointerDownDrag={(e) => onPointerDownDrag(e, index)}
					register={register}
					control={control}
					setValue={setValue}
					index={index}
					questionType={field.questionType}
				/>
			)}

			{field.type === "title" && (
				<TitleAndDesForm
					activeElement={isActive}
					onDelete={() => onDeleteField(index)}
					onDuplicate={() => onDuplicateField?.(index)}
					onPointerDownDrag={(e) => onPointerDownDrag(e, index)}
					register={register}
					control={control}
					setValue={setValue}
					index={index}
				/>
			)}

			{field.type === "image" && (
				<ImageSectionForm
					activeElement={isActive}
					onDelete={() => onDeleteField(index)}
					onDuplicate={() => onDuplicateField?.(index)}
					onPointerDownDrag={(e) => onPointerDownDrag(e, index)}
					register={register}
					control={control}
					setValue={setValue}
					index={index}
				/>
			)}
		</div>
	);
};

FormSectionItem.propTypes = {
	field: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		type: PropTypes.string.isRequired,
		questionType: PropTypes.string,
	}).isRequired,
	index: PropTypes.number.isRequired,
	realIndex: PropTypes.number.isRequired,
	isActive: PropTypes.bool.isRequired,
	isCurrentDragged: PropTypes.bool.isRequired,
	cardStyle: PropTypes.object,
	sectionRef: PropTypes.func.isRequired,
	onSectionClick: PropTypes.func.isRequired,
	onDeleteField: PropTypes.func.isRequired,
	onDuplicateField: PropTypes.func,
	onPointerDownDrag: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	control: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
};

export default FormSectionItem;
