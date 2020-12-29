import Image from "next/image";
export const Cloudinary = ({
  src,
  width = false,
  height = false,
  loading = "lazy",
  cloud = 'loklok-keystone',
  ...props
}) => {
  const hostUrl = `https://res.cloudinary.com/${cloud}/image/upload/q_auto`;
  if (width) {
    hostUrl += `,w_${width}`
  }
  if (height) {
    hostUrl += `,h_${height}`
  }

  return (
    <img
      {...props}
      src={`${hostUrl}${src}`}
    />
  );
};