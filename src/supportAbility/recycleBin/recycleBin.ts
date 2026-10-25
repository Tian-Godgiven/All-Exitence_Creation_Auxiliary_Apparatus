import { addToRightPage } from "@/hooks/pages/rightPage";
import { openMainToolPage } from "@/hooks/pages/mainPage/toolPage";
import type { SupportAbilitySignUpItem } from "@/static/list/supportAbilityList";

export const recycleBinItem: SupportAbilitySignUpItem = {
  name: "recycleBin",
  init: () => {
    addToRightPage({
      key: "recycle-bin",
      name: "回收站",
      icon: "delete",
      click: () => {
        void showRecycleBin();
      },
      });
  },
  call: () => {
    void showRecycleBin();
  },
};

async function showRecycleBin(): Promise<void> {
  const { default: RecycleBin } = await import("./RecycleBin.vue");
  openMainToolPage({
    name: "回收站",
    component: RecycleBin,
  });
}
