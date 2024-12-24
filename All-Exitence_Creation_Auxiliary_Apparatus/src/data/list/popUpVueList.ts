import questionListVue from '@/popUps/supportAbility/questionList.vue';
import createCalendarVue from '@/popUps/supportAbility/createCalendar.vue';
import createTypeVue from '@/popUps/all-exitence/createType.vue';
import createExitenceVue from '@/popUps/all-exitence/createExitence.vue';
import updateStatusVue from '@/popUps/all-exitence/updateStatus.vue';
import createStatusVue from '@/popUps/all-exitence/createStatus.vue';
import createGroupVue from '@/popUps/all-exitence/createGroup.vue';
import updateGroupVue from '@/popUps/all-exitence/updateGroup.vue';
import showExitenceVue from '@/popUps/all-exitence/showExitence.vue';

// 用于显示不同Vue组件的弹窗
export let popUpVueList:{[key:string]:any} = {
	"questionList":questionListVue,
	"createCanlendar":createCalendarVue,

	
	"createType":createTypeVue,
	"createGroup":createGroupVue,
	"updateGroup":updateGroupVue,

	"createExitence":createExitenceVue,
	"showExitence":showExitenceVue,

	"createStatus":createStatusVue,
	"updateStatus":updateStatusVue,


}