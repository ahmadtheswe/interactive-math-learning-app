/**
 * Main container file that imports all module containers
 * This ensures all dependencies are registered properly
 */
import 'reflect-metadata';

// Import all module containers
import './modules/profile/container';
import './modules/lesson/container';
import './modules/submission/container';

// Import the container instance to make it available
export { container } from 'tsyringe';
