import { Test, TestingModule } from '@nestjs/testing';
import { LinesController } from './lines.controller';
import { LinesService } from './lines.service';

describe('LinesController', () => {
  let controller: LinesController;
  let service: LinesService;

  const mockStopsService = {
    getAllLines: jest.fn(),
    getLinesByName: jest.fn(),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinesController],
      providers: [
        {
          provide: LinesService,
          useValue: mockStopsService,
        },
      ],
    }).compile();

    controller = module.get<LinesController>(LinesController);
    service = module.get<LinesService>(LinesService);
  });

  it('deve retornar todas as linhas', async () => {
    const mockLines = [{ id: 1, name: 'Linha teste' }];
    (service.getAllLines as jest.Mock).mockResolvedValue(mockLines);

    const result = await controller.getAllLines();
    expect(result).toEqual(mockLines);
    expect(service.getAllLines).toHaveBeenCalled();
  });

  it('deve lançar erro ao falhar em buscar linhas', async () => {
    (service.getAllLines as jest.Mock).mockRejectedValue(new Error());

    await expect(controller.getAllLines()).rejects.toThrow('Falha ao buscar as linhas');
  });

  it('deve retornar linhas filtradas pelo nome', async () => {
    const mockLines = [{ id: 2, name: 'Linha teste' }];
    (service.getLinesByName as jest.Mock).mockResolvedValue(mockLines);

    const result = await controller.getLines('Linha teste');
    expect(result).toEqual(mockLines);
    expect(service.getLinesByName).toHaveBeenCalledWith('Linha teste');
  });

  it('deve lançar erro se nenhuma linha for encontrada pelo nome', async () => {
    (service.getLinesByName as jest.Mock).mockResolvedValue([]);

    await expect(controller.getLines('Inexistente')).rejects.toThrow('Nenhuma linha encontrada!');
  });

  it('deve retornar todas as linhas se nenhum nome for passado', async () => {
    const mockLines = [{ id: 3, name: 'Linha teste' }];
    (service.getAllLines as jest.Mock).mockResolvedValue(mockLines);

    const result = await controller.getLines();
    expect(result).toEqual(mockLines);
    expect(service.getAllLines).toHaveBeenCalled();
  });
});
