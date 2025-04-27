type Node = {
    type: { resolvedName: string };
    props: any;
    nodes?: string[];
  };
  
  type NodeTree = Record<string, Node>;
  
  export function parseNodeTreeToHTML(tree: NodeTree) {
    const renderNode = (nodeId: string): string => {
      const node = tree[nodeId];
      if (!node) return '';
  
      const { resolvedName } = node.type;
      const props = node.props || {};
      const childrenHTML = (node.nodes || []).map(renderNode).join('');
  
      switch (resolvedName) {
        case 'TextBlock':
          return `<div>${props.text || ''}</div>`;
  
        case 'ContainerBlock':
          return `<div class="container">${childrenHTML}</div>`;
  
        case 'SliderBlock':
          return `<div class="swiper-container">${childrenHTML}</div>`;
  
        case 'AnimateBlock':
          return `<div data-aos="${props.animationType || 'fade-up'}">${childrenHTML}</div>`;
  
        case 'AccordionBlock':
          return `<div class="accordion">${childrenHTML}</div>`;
  
        case 'TabsBlock':
          return `<div class="tabs">${childrenHTML}</div>`;
  
        default:
          return `<div>${childrenHTML}</div>`;
      }
    };
  
    return renderNode('ROOT');
  }
  