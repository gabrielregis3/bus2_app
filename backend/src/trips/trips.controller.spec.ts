import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: {
            getAllTrips: jest.fn(),
            getTripByName: jest.fn(),
            getTripsByStopName: jest.fn(),
            getTripsByStopId: jest.fn(),
            getTripsAndPathByName: jest.fn(),
            getTripsByLineId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
  });

  it('deve retornar todas as viagens', async () => {
    const trips = [{
      id: 1,
      name: 'Viagem teste',
      line_id: 1,
      path: 'path',
      stops: [{
        id: 1,
        sequence: 1,
        stop_id: 1,
        trip_id: 1,
        latitude: 0 as any,
        longitude: 0 as any,
        stop_name: 'Parada X',
      }]
    }];

    jest.spyOn(service, 'getAllTrips').mockResolvedValue(trips);

    expect(await controller.getAllTrips()).toBe(trips);
  });

  it('deve retornar viagens por nome', async () => {
    const trips = [{
      id: 1,
      name: 'Viagem teste',
      line_id: 1,
      path: 'path',
      stops: [{
        id: 1,
        sequence: 1,
        stop_id: 1,
        trip_id: 1,
        latitude: 0 as any,
        longitude: 0 as any,
        stop_name: 'Nome Parada',
      }]
    }];

    jest.spyOn(service, 'getTripByName').mockResolvedValue(trips);

    expect(await controller.getTrips('Viagem A')).toBe(trips);
  });

  it('deve lançar erro se nenhuma viagem for encontrada por nome', async () => {
    jest.spyOn(service, 'getTripByName').mockResolvedValue([]);
    await expect(controller.getTrips('Inexistente')).rejects.toThrow('Nenhuma viagem encontrada!');
  });

  it('deve retornar viagens por nome de parada', async () => {
    const trips = [{
      id: 1,
      name: 'Viagem teste',
      line_id: 1,
      path: 'ath',
      stops: [{
        id: 1,
        sequence: 1,
        stop_id: 1,
        trip_id: 1,
        latitude: 0 as any,
        longitude: 0 as any,
        stop_name: 'Nome Parada',
      }]
    }];

    jest.spyOn(service, 'getTripsByStopName').mockResolvedValue(trips);

    expect(await controller.getTripsByStop('Parada teste')).toBe(trips);
  });

  it('deve lançar erro se nenhuma viagem for encontrada por parada', async () => {
    jest.spyOn(service, 'getTripsByStopName').mockResolvedValue([]);
    await expect(controller.getTripsByStop('Inexistente')).rejects.toThrow('Nenhuma viagem encontrada!');
  });

  it('deve retornar viagens por ID de parada', async () => {
    const trips = [{ id: 1 }];
    jest.spyOn(service, 'getTripsByStopId').mockResolvedValue(trips);

    expect(await controller.getTripsByStopId(1)).toBe(trips);
  });

  it('deve lançar erro se stop_id não for informado', async () => {
    await expect(controller.getTripsByStopId(undefined)).rejects.toThrow('stop_id é obrigatório');
  });

  it('deve retornar viagens com path por nome', async () => {
    const response = {
      id: 1,
      name: 'Viagem teste',
      line_id: 10,
      path: 'path',
      stops: [
        {
          id: 1,
          stop_id: 101,
          trip_id: 1,
          sequence: 1,
          latitude: 0 as any,
          longitude: 0 as any,
          stop_name: 'Nome Parada',
        },
      ],
    };
    
    jest.spyOn(service, 'getTripsAndPathByName').mockResolvedValue(response);

    expect(await controller.getTripsAndPath('Trip A')).toBe(response);
  });

  it('deve lançar erro se nenhuma viagem for encontrada com path', async () => {
    jest.spyOn(service, 'getTripsAndPathByName').mockResolvedValue(null);
    await expect(controller.getTripsAndPath('Inexistente')).rejects.toThrow('Nenhuma viagem encontrada!');
  });

  it('deve retornar viagens por ID de linha', async () => {
    const trips = [
      {
        id: 1,
        line_id: 10,
        name: 'Nome Linha',
        path: 'path',
      },
    ];
    jest.spyOn(service, 'getTripsByLineId').mockResolvedValue(trips);

    expect(await controller.getTripsByLine('1')).toBe(trips);
  });

  it('deve lançar erro se trip_id (lineId) não for informado', async () => {
    await expect(controller.getTripsByLine(undefined)).rejects.toThrow('trip_id é obrigatório');
  });
});
