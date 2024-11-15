import questionListVue from '@/components/popUps/questionList.vue';
import createCalendarVue from '@/components/popUps/createCalendar.vue';
import createTypeVue from '../../components/popUps/all-exitence/createType.vue';


// 用于显示不同Vue组件的弹窗
export let popUpVueList = {
	"questionList":questionListVue,
	"createCanlendar":createCalendarVue,
	"createType":createTypeVue
}