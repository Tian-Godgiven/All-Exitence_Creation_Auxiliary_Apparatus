import rangeBonusVue from "@/components/all-exitence/status/valueType/range/rangeBonus.vue";
import multiBonusVue from "@/components/all-exitence/status/valueType/multi/multiBonus.vue";
import switchBonusVue from "@/components/all-exitence/status/valueType/switch/switchBonus.vue";
import radioBonusVue from "@/components/all-exitence/status/valueType/radio/radioBonus.vue";
import selectBonusVue from "@/components/all-exitence/status/valueType/select/selectBonus.vue";
import chooseBonusVue from "@/components/all-exitence/status/valueType/choose/chooseBonus.vue";
import relationBonusVue from "@/components/all-exitence/status/valueType/relation/relationBonus.vue";
import DateBonusVue from "@/components/all-exitence/status/valueType/date/dateBonus.vue";

export let statusBonusInputList:{[key:string]:any} = {
	"range":rangeBonusVue,
	"select":selectBonusVue,
	"choose":chooseBonusVue,
	"multi":multiBonusVue,
	"switch":switchBonusVue,
	"radio":radioBonusVue,
	"relation":relationBonusVue,
	"date":DateBonusVue,
}