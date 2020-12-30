import Image from "next/image";

const NextCloudinaryImage = ({
  media,
  width = media.cloudinary.width,
  height = media.cloudinary.height,
}) => {
  const { src = media.cloudinary.auto,
    loading = "lazy" } = {}

  return (
    <Image
      class="object-center object-cover w-full h-full"
      src={`${src}`}
      alt={media.text}
      width={width}
      height={height}
      layout="responsive"
      quality={10}
      loading={loading}
    />
  );
};

export default NextCloudinaryImage;