/**
 * A utility for observing DOM mutations using the modern MutationObserver API
 * instead of the deprecated DOM mutation events like DOMNodeInserted.
 */

/**
 * Creates a new MutationObserver to watch for DOM changes
 * @param targetNode The node to observe
 * @param callback Function to call when mutations occur
 * @param config Configuration options for the observer
 * @returns A MutationObserver instance that can be used to stop observing
 */
export function observeDOMChanges(
  targetNode: Node,
  callback: MutationCallback,
  config: MutationObserverInit = {
    childList: true,    // Observe direct children
    subtree: true,      // And lower descendants too
    attributes: true,   // And attributes
    characterData: true // And text content
  }
): MutationObserver {
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
  
  // Return the observer so it can be disconnected later
  return observer;
}

/**
 * A simplified version that only observes nodes being added to the DOM
 * @param targetNode The node to observe
 * @param callback Function to call when nodes are added
 * @returns A MutationObserver instance
 */
export function observeNodeAdditions(
  targetNode: Node,
  callback: (addedNodes: NodeList) => void
): MutationObserver {
  return observeDOMChanges(
    targetNode,
    (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          callback(mutation.addedNodes);
        }
      }
    },
    { childList: true, subtree: true }
  );
}

/**
 * A simplified version that only observes attribute changes
 * @param targetNode The node to observe
 * @param callback Function to call when attributes change
 * @param attributeFilter Optional array of attribute names to observe
 * @returns A MutationObserver instance
 */
export function observeAttributeChanges(
  targetNode: Node,
  callback: (mutation: MutationRecord) => void,
  attributeFilter?: string[]
): MutationObserver {
  return observeDOMChanges(
    targetNode,
    (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          callback(mutation);
        }
      }
    },
    { attributes: true, attributeFilter }
  );
} 