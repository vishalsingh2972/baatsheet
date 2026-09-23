import { MdOutlineAutoAwesome } from "react-icons/md";

const ImageAILoadingView = () => {
	return (
		<div className="my-auto flex flex-col items-center justify-center text-center select-none animate-fade-in">
			<div className="relative w-16 h-16 mb-4 flex items-center justify-center">
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] opacity-25 animate-ping blur-xs" />
				<div className="relative w-13 h-13 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] flex items-center justify-center shadow-md">
					<MdOutlineAutoAwesome className="text-white text-2xl animate-spin [animation-duration:5s]" />
				</div>
			</div>
			<h4 className="text-base font-bold text-[#1F1F1F]">
				Generating image with AI...
			</h4>
			<p className="text-xs text-[#5F6368] mt-1 font-normal">
				Crafting high-resolution visual matching your prompt...
			</p>
		</div>
	);
};

export default ImageAILoadingView;
