import questionListVue from '@/components/popUps/supportAbility/questionList.vue';
import createCalendarVue from '@/components/popUps/supportAbility/createCalendar.vue';
import createTypeVue from '@/components/popUps/all-exitence/type/createType.vue';

// 用于显示不同Vue组件的弹窗
export let popUpVueList = {
	"questionList":questionListVue,
	"createCanlendar":createCalendarVue,
	"createType":createTypeVue,
}