import mitt from "mitt";

type Events = {
  showToast: string;
  showError: string;
};

const emitter = mitt<Events>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
