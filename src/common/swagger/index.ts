export type SwaggerExample<T = any> = {
    summary: string;
    description: string;
    value: T;
  };
  
  export {
    loginExamples,
    LoginExample,
  } from './examples/auth.examples';
  
  export {
    createProfessorExamples,
    updateProfessorExamples,
  } from './examples/professor.examples';
  
  export {
    createProjectExamples,
    updateProjectExamples,
  } from './examples/project.examples';
  
  export {
    createApplicationExamples,
    updateApplicationStatusExamples,
  } from './examples/application.examples';