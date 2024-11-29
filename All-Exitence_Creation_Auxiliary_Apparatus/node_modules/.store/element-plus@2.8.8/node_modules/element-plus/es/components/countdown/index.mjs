import '../../utils/index.mjs';
import Countdown from './src/countdown.mjs';
export { countdownEmits, countdownProps } from './src/countdown2.mjs';
import { withInstall } from '../../utils/vue/install.mjs';

const ElCountdown = withInstall(Countdown);

export { ElCountdown, ElCountdown as default };
//# sourceMappingURL=index.mjs.map
