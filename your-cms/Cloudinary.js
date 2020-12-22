import Image from "next/image";
export const Cloudinary = ({
  src,
  width = 240,
  height = 750,
  loading = "lazy",
  cloud = 'loklok-keystone'
}) => {
  const hostUrl = `https://res.cloudinary.com/${cloud}/image/upload/q_auto,w_${width},h_${height}`;

  return (
    <Image
      class="object-center object-cover w-full h-full"
      src={`${hostUrl}/${src}`}
      alt="Picture of the author"
      width={width}
      height={height}
      layout="responsive"
      quality={10}
      loading={loading}
    />
  );
};