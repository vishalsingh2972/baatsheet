const Divider = () => {
	return (
		<div className="flex items-center my-6 md:my-[30px]">
			<div className="w-full h-px bg-[#4E5D78]/20" />
			<p className="roboto-bold text-[#4E5D78] text-xs md:text-[18px] mx-[10px] md:mx-[21px]">
				OR
			</p>
			<div className="w-full h-px bg-[#4E5D78]/20" />
		</div>
	);
};

export default Divider;
