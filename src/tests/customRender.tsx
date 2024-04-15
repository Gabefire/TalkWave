import { RenderOptions, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactElement } from "react";
import { authContextType } from "../types/auth";
import ChannelListContext, {
  channelListContextType,
} from "../contexts/channelListContext";
import { AuthContext } from "../contexts/authProvider";

export const customRender = (
  ui: ReactElement,
  providerProps: authContextType,
  channelListProps: channelListContextType,
  renderOptions?: Omit<RenderOptions, "wrapper">
) => {
  return render(
    <AuthContext.Provider value={{ ...providerProps }}>
      <ChannelListContext.Provider value={{ ...channelListProps }}>
        {ui}
      </ChannelListContext.Provider>
    </AuthContext.Provider>,
    renderOptions
  );
};
