import { css } from "@emotion/react";

const hideScrollbar = css`
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

export default hideScrollbar;
