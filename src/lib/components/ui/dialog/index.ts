/** Dialog primitive components from bits-ui with custom styling */
import { Dialog as DialogPrimitive } from 'bits-ui';

/** Custom dialog components */
import Content from './dialog-content.svelte';
import Description from './dialog-description.svelte';
import Footer from './dialog-footer.svelte';
import Header from './dialog-header.svelte';
import Overlay from './dialog-overlay.svelte';
import Portal from './dialog-portal.svelte';
import Title from './dialog-title.svelte';

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;

/** Re-export dialog components with both original and aliased names */
export {
	Close,
	Content,
	Description,
	//
	Root as Dialog,
	Close as DialogClose,
	Content as DialogContent,
	Description as DialogDescription,
	Footer as DialogFooter,
	Header as DialogHeader,
	Overlay as DialogOverlay,
	Portal as DialogPortal,
	Title as DialogTitle,
	Trigger as DialogTrigger,
	Footer,
	Header,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger
};
