import { Test, TestingModule } from '@nestjs/testing';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';

describe('StopsController', () => {
  let controller: StopsController;
  let service: StopsService;

  const mockStopsService = {
    getAllStops: jest.fn(),
    getStopsByName: jest.fn(),
    getStopsByTripId: jest.fn(),
    getCoordinatesByTripId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StopsController],
      providers: [
        {
          provide: StopsService,
          useValue: mockStopsService,
        },
      ],
    }).compile();

    controller = module.get<StopsController>(StopsController);
    service = module.get<StopsService>(StopsService);
  });

  it('deve retornar todas as paradas', async () => {
    const mockStops = [{ id: 1, name: 'Parada teste' }];
    service.getAllStops = jest.fn().mockResolvedValue(mockStops);

    const result = await controller.getAllStops();
    expect(result).toEqual(mockStops);
    expect(service.getAllStops).toHaveBeenCalled();
  });

  it('deve buscar paradas por nome', async () => {
    const mockStops = [{ id: 2, name: 'Central' }];
    service.getStopsByName = jest.fn().mockResolvedValue(mockStops);

    const result = await controller.getStops('Central');
    expect(result).toEqual(mockStops);
    expect(service.getStopsByName).toHaveBeenCalledWith('Central');
  });

  it('deve retornar erro se nenhuma parada for encontrada por nome', async () => {
    service.getStopsByName = jest.fn().mockResolvedValue([]);
    await expect(controller.getStops('Inexistente')).rejects.toThrow('Nenhuma parada encontrada!');
  });

  it('deve buscar paradas por trip_id', async () => {
    const mockStops = [{ id: 3, name: 'Terminal' }];
    service.getStopsByTripId = jest.fn().mockResolvedValue(mockStops);

    const result = await controller.getStopsByTrip(1);
    expect(result).toEqual(mockStops);
    expect(service.getStopsByTripId).toHaveBeenCalledWith(1);
  });

  it('deve retornar erro se trip_id nao for informado', async () => {
    await expect(controller.getStopsByTrip(undefined)).rejects.toThrow('trip_id é obrigatório');
  });

  it('deve buscar coordenadas por trip_id', async () => {
    const mockCoords = [{ lat: 1.23, lng: 4.56 }];
    service.getCoordinatesByTripId = jest.fn().mockResolvedValue(mockCoords);

    const result = await controller.getCoordinatesByTrip(1);
    expect(result).toEqual(mockCoords);
    expect(service.getCoordinatesByTripId).toHaveBeenCalledWith(1);
  });

  it('deve retornar erro se trip_id nao for informado', async () => {
    await expect(controller.getCoordinatesByTrip(undefined)).rejects.toThrow('trip_id é obrigatório');
  });

  it('deve retornar erro se nenhuma coordenada for encontrada', async () => {
    service.getCoordinatesByTripId = jest.fn().mockResolvedValue([]);
    await expect(controller.getCoordinatesByTrip(1)).rejects.toThrow('Nenhuma coordenada encontrada!');
  });
});
