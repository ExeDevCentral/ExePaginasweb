"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComponent = addComponent;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function addComponent(name, options) {
    const { type, withStyles, withTests } = options;
    console.log(`⚡ Adding ${type} component: ${name}`);
    try {
        // Check if we're in a project directory
        if (!fs_1.default.existsSync('package.json')) {
            console.error('❌ Not in a project directory. Run this command from your project root.');
            process.exit(1);
        }
        const componentsDir = 'src/components';
        if (!fs_1.default.existsSync(componentsDir)) {
            fs_1.default.mkdirSync(componentsDir, { recursive: true });
        }
        const componentDir = path_1.default.join(componentsDir, name);
        if (!fs_1.default.existsSync(componentDir)) {
            fs_1.default.mkdirSync(componentDir, { recursive: true });
        }
        // Create component file
        let componentContent = '';
        if (type === 'functional') {
            componentContent = `import { motion } from 'framer-motion'
import { useState } from 'react'

interface ${name}Props {
  className?: string
}

const ${name} = ({ className = '' }: ${name}Props) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <motion.div
      className={\`\${className}\`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">${name} Component</h2>
      <p className="text-primary-secondary">
        This is the ${name} component. Customize it as needed!
      </p>

      <motion.button
        className="mt-4 px-4 py-2 bg-accent-cyan text-primary-bg rounded-lg hover:bg-accent-cyan/80 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide' : 'Show'} Details
      </motion.button>

      {isVisible && (
        <motion.div
          className="mt-4 p-4 bg-primary-bg/50 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <p>Additional details for the ${name} component...</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ${name}
`;
        }
        else if (type === 'class') {
            componentContent = `import { Component } from 'react'
import { motion } from 'framer-motion'

interface ${name}Props {
  className?: string
}

interface ${name}State {
  isVisible: boolean
}

class ${name} extends Component<${name}Props, ${name}State> {
  constructor(props: ${name}Props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }

  render() {
    const { className = '' } = this.props
    const { isVisible } = this.state

    return (
      <motion.div
        className={\`\${className}\`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">${name} Component</h2>
        <p className="text-primary-secondary">
          This is the ${name} component. Customize it as needed!
        </p>

        <motion.button
          className="mt-4 px-4 py-2 bg-accent-cyan text-primary-bg rounded-lg hover:bg-accent-cyan/80 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={this.toggleVisibility}
        >
          {isVisible ? 'Hide' : 'Show'} Details
        </motion.button>

        {isVisible && (
          <motion.div
            className="mt-4 p-4 bg-primary-bg/50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p>Additional details for the ${name} component...</p>
          </motion.div>
        )}
      </motion.div>
    )
  }
}

export default ${name}
`;
        }
        fs_1.default.writeFileSync(path_1.default.join(componentDir, `${name}.tsx`), componentContent);
        // Create styles file if requested
        if (withStyles) {
            const stylesContent = `/* ${name} component styles */
.${name.toLowerCase()} {
  /* Add your custom styles here */
}

.${name.toLowerCase()}__header {
  @apply text-2xl font-bold mb-4;
}

.${name.toLowerCase()}__content {
  @apply text-primary-secondary;
}

.${name.toLowerCase()}__button {
  @apply mt-4 px-4 py-2 bg-accent-cyan text-primary-bg rounded-lg hover:bg-accent-cyan/80 transition-colors;
}
`;
            fs_1.default.writeFileSync(path_1.default.join(componentDir, `${name}.module.css`), stylesContent);
        }
        // Create test file if requested
        if (withTests) {
            const testContent = `import { render, screen, fireEvent } from '@testing-library/react'
import ${name} from './${name}'

describe('${name} Component', () => {
  test('renders ${name} component', () => {
    render(<${name} />)
    expect(screen.getByText('${name} Component')).toBeInTheDocument()
  })

  test('toggles visibility on button click', () => {
    render(<${name} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Additional details for the ${name} component...')).toBeInTheDocument()
  })
})
`;
            fs_1.default.writeFileSync(path_1.default.join(componentDir, `${name}.test.tsx`), testContent);
        }
        // Update index file for easy imports
        const indexPath = path_1.default.join(componentsDir, 'index.ts');
        let indexContent = '';
        if (fs_1.default.existsSync(indexPath)) {
            indexContent = fs_1.default.readFileSync(indexPath, 'utf-8');
        }
        if (!indexContent.includes(`export { default as ${name} }`)) {
            indexContent += `export { default as ${name} } from './${name}/${name}'\n`;
            fs_1.default.writeFileSync(indexPath, indexContent);
        }
        console.log('✅ Component created successfully!');
        console.log(`📁 Location: ${componentDir}`);
        console.log('');
        console.log('Files created:');
        console.log(`  • ${name}.tsx`);
        if (withStyles)
            console.log(`  • ${name}.module.css`);
        if (withTests)
            console.log(`  • ${name}.test.tsx`);
        console.log('');
        console.log('To use the component:');
        console.log(`  import ${name} from './components/${name}/${name}'`);
    }
    catch (error) {
        console.error('❌ Error adding component:', error);
        process.exit(1);
    }
}
//# sourceMappingURL=add-component.js.map