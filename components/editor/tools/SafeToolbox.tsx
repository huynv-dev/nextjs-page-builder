'use client';

import { withEditorContext } from '../wrappers/withEditorContext';
import { Toolbox } from './Toolbox';

/**
 * A version of Toolbox that's safe to use outside of Editor context
 * This component will automatically be wrapped in an Editor context if needed
 */
export const SafeToolbox = withEditorContext(Toolbox); 