import rangeBonusVue from "@/components/popUps/all-exitence/status/statusBonusInput/rangeBonus.vue";
import multiBonusVue from "../../components/popUps/all-exitence/status/statusBonusInput/multiBonus.vue";
import switchBonusVue from "../../components/popUps/all-exitence/status/statusBonusInput/switchBonus.vue";
import radioBonusVue from "../../components/popUps/all-exitence/status/statusBonusInput/radioBonus.vue";
import childStatusBonusVue from "../../components/popUps/all-exitence/status/statusBonusInput/childStatusBonus.vue";
import selectBonusVue from "../../components/popUps/all-exitence/status/statusBonusInput/selectBonus.vue";
import chooseBonusVue from "../../components/popUps/all-exitence/status/statusBonusInput/chooseBonus.vue";

export let statusBonusInputList = {
	"range":rangeBonusVue,
	"select":selectBonusVue,
	"choose":chooseBonusVue,
	"multi":multiBonusVue,
	"switch":switchBonusVue,
	"radio":radioBonusVue,
	"status":childStatusBonusVue
}