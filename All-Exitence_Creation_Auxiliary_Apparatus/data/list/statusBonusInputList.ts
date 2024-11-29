import rangeBonusVue from "@/components/popUps/all-exitence/statusBonusInput/rangeBonus.vue";
import multiBonusVue from "../../components/popUps/all-exitence/statusBonusInput/multiBonus.vue";
import switchBonusVue from "../../components/popUps/all-exitence/statusBonusInput/switchBonus.vue";
import radioBonusVue from "../../components/popUps/all-exitence/statusBonusInput/radioBonus.vue";
import childStatusBonusVue from "../../components/popUps/all-exitence/statusBonusInput/childStatusBonus.vue";
import selectBonusVue from "../../components/popUps/all-exitence/statusBonusInput/selectBonus.vue";
import chooseBonusVue from "../../components/popUps/all-exitence/statusBonusInput/chooseBonus.vue";

export let statusBonusInputList = {
	"range":rangeBonusVue,
	"select":selectBonusVue,
	"choose":chooseBonusVue,
	"multi":multiBonusVue,
	"switch":switchBonusVue,
	"radio":radioBonusVue,
	"status":childStatusBonusVue
}