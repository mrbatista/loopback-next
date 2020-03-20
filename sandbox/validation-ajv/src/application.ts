import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {ProductRepository} from './repositories';
import {MySequence} from './sequence';

export class ValidationAjvApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      validation: {
        keywords: {
          uniqueness: {
            async: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validate: async (schema: any, data: any, parentSchema: any, currentDataPath: any, parentDataObject: any, propertyName: any) => {
              const repository = await this.getRepository(ProductRepository);
              const where = {} as any;
              where[propertyName] = data;
              const found = await repository.findOne({where});

              return found === null;
            }
          }
        }
      }
    });

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
