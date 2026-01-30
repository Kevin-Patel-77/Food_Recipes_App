import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

interface ChatSkeletonProps {
  align?: "left" | "right";
}

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const ChatSkeleton = ({ align = "left" }: ChatSkeletonProps) => {
  const isRight = align === "right";

  const shimmerStyle = {
    background: `linear-gradient(
      90deg,
      #ffd9b3 25%,
      #fff4e6 50%,
      #ffd9b3 75%
    )`,
    backgroundSize: "200% 100%",
    animation: `${shimmer} 1.2s linear infinite`,
  };

  return (
    <Box
      sx={{
        alignSelf: isRight ? "flex-end" : "flex-start",
        width: "60%",
        padding: "10px 14px",
        borderRadius: "12px",
      }}
    >
      {/* line 1 */}
      <Box
        sx={{
          ...shimmerStyle,
          height: isRight ? 30 : 18,
          width: isRight ? "90%" : "75%",
          mb: 1,
          borderRadius: "8px",
        }}
      />

      {/* line 2 */}
      <Box
        sx={{
          ...shimmerStyle,
          height: isRight ? 30 : 18,
          width: isRight ? "70%" : "55%",
          borderRadius: "8px",
        }}
      />
    </Box>
  );
};
