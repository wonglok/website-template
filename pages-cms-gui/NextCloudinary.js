import Image from "next/image";

const NextCloudinaryImage = ({
  media,
  src = media.cloudinary.auto,
  width = media.cloudinary.width,
  height = media.cloudinary.height,
  className = '',
  loading = 'lazy',
  children
}) => {
  return (
    <div className={className}>
      <Image
        className={"object-center object-cover w-full h-full"}
        src={`${src}`}
        alt={media.text}
        width={width}
        height={height}
        layout="responsive"
        quality={10}
        loading={loading}
      />
      {children}
    </div>
  );
};

export default NextCloudinaryImage;