import questionListVue from '@/popUps/supportAbility/questionList.vue';
import createCalendarVue from '@/popUps/supportAbility/createCalendar.vue';
import createTypeVue from '@/popUps/all-exitence/createType.vue';
import createExitenceVue from '@/popUps/all-exitence/createExitence.vue';
import updateStatusVue from '@/popUps/all-exitence/updateStatus.vue';

// 用于显示不同Vue组件的弹窗
export let popUpVueList:{[key:string]:any} = {
	"questionList":questionListVue,
	"createCanlendar":createCalendarVue,
	"createType":createTypeVue,
	"createExitence":createExitenceVue,
	"updateStatus":updateStatusVue
}