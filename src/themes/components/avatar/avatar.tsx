"use client";

import React from "react";
import { Avatar as AntAvatar } from "antd";
import styles from "./avatar.module.scss";

interface CustomAvatarProps {
  initial?: string; // Initials to display in the avatar
  backgroundColor?: string; // Background color of the avatar
  textColor?: string; // Text color of the initials
  borderColor?: string; // Border color of the avatar
  size?: number | "small" | "large" | "default"; // Avatar size
  shape?: "circle" | "square"; // Avatar shape
  className?: string; // Custom class for additional styling
  style?: React.CSSProperties; // Inline styles for customization
  icon?: React.ReactNode; // Icon to display in the avatar
  src?: string; // Source URL for the avatar image
}

const Avatar: React.FC<CustomAvatarProps> = ({
  initial,
  backgroundColor,
  textColor,
  borderColor,
  size = "default",
  shape = "circle",
  className,
  style,
  icon,
  src,
}) => {
  return (
    <AntAvatar
      className={`${styles.avatar} ${className || ""}`}
      size={size}
      shape={shape}
      icon={icon}
      src={src}
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        borderColor: borderColor || undefined,
        ...style, // Merge custom inline styles
      }}
    >
      {initial}
    </AntAvatar>
  );
};

export default Avatar;