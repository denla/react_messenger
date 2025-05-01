const Avatar = ({ size, name, img_url, online }) => {
  return (
    <div
      className={`a ${online && "a-online"}`}
      style={{
        backgroundImage: `url(http://localhost:3001/${img_url})`,
        width: `${size}px`,
      }}
    >
      <span style={{ fontSize: `${size * 0.3}px` }}>
        {!img_url && name?.slice(0, 1).toUpperCase()}{" "}
      </span>
    </div>
  );
};

export default Avatar;
