
import createExitenceVue from '@/popUps/all-exitence/createExitence.vue';
import editStatusVue from '@/popUps/all-exitence/EditStatusPopUp.vue';
import showExitenceVue from '@/popUps/all-exitence/ShowExitencePopUp.vue';
import alertVue from '@/popUps/alert.vue';
import editProjectInfoVue from '@/popUps/project/editProjectInfo.vue';
import editChapterVue from '@/popUps/all-articles/editChapter.vue';
import editGroupVue from '@/popUps/all-exitence/editGroup.vue';
import setExitenceVue from '@/popUps/all-exitence/setExitence.vue';
import setTypeVue from '@/popUps/all-exitence/setType.vue';

// 用于显示不同Vue组件的弹窗
export let popUpVueList:{[key:string]:any} = {
	"showAlert":alertVue,

	"createProject":editProjectInfoVue,
	"editProject":editProjectInfoVue,

	"createChapter":editChapterVue,
	"updateChapter":editChapterVue,
	
	"createGroup":editGroupVue,
	"updateGroup":editGroupVue,

	"createExitence":createExitenceVue,
	"showExitence":showExitenceVue,
	"setExitence":setExitenceVue,
	"setType":setTypeVue,

	"createStatus":editStatusVue,
	"updateStatus":editStatusVue,
}
