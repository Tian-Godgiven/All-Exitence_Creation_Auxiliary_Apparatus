import questionListVue from '@/popUps/supportAbility/questionList.vue';
import createCalendarVue from '@/popUps/supportAbility/createCalendar.vue';
import createExitenceVue from '@/popUps/all-exitence/createExitence.vue';
import editStatusVue from '@/popUps/all-exitence/editStatus.vue';
import createGroupVue from '@/popUps/all-exitence/createGroup.vue';
import updateGroupVue from '@/popUps/all-exitence/updateGroup.vue';
import showExitenceVue from '@/popUps/all-exitence/showExitence.vue';
import alertVue from '@/popUps/alert.vue';
import editProjectInfoVue from '@/popUps/project/editProjectInfo.vue';
import editChapterVue from '@/popUps/all-articles/editChapter.vue';
import controlPanelVue from '@/popUps/controlPanel.vue';
import editTypeVue from '@/popUps/all-exitence/editType.vue';
import setExitenceVue from '@/popUps/all-exitence/setExitence.vue';

// 用于显示不同Vue组件的弹窗
export let popUpVueList:{[key:string]:any} = {
	"questionList":questionListVue,
	"createCanlendar":createCalendarVue,

	"showAlert":alertVue,
	"showControlPanel":controlPanelVue,

	"createProject":editProjectInfoVue,
	"editProject":editProjectInfoVue,

	"createChapter":editChapterVue,
	"updateChapter":editChapterVue,

	
	"createType":editTypeVue,
	"updateType":editTypeVue,

	"createGroup":createGroupVue,
	"updateGroup":updateGroupVue,

	"createExitence":createExitenceVue,
	"showExitence":showExitenceVue,
	"setExitence":setExitenceVue,

	"createStatus":editStatusVue,
	"updateStatus":editStatusVue,


}