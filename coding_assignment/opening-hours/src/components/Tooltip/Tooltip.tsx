import { TooltipProps } from '../../utills/types';
import './Tooltip.css';

// type TooltipProps = {
//     text: string,
// };

const Tooltip = ({ text }: TooltipProps) => {
    return (
        <div className="tooltip">
            {text}
        </div>
    );
}

export default Tooltip;