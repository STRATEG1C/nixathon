import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthz')
  getHealthz() {
    return {
      status: 'OK',
    };
  }

  @Post('negotiate')
  negotiate(@Req() request: Request) {
    const {
      playerTower: { playerId, hp, armor, resources },
      enemyTowers,
      combatActions,
    } = request as any;

    const allyId = enemyTowers[0].playerId;
    const attackTargetId = enemyTowers[1].playerId;

    // enemyTowers.forEach((enemy) => {
    //
    // });

    return [
      {
        "allyId": allyId,
        "attackTargetId": attackTargetId
      },
    ];
  }

  @Post('combat')
  combat(@Req() request: Request) {
    const {
      playerTower: { playerId, hp, armor, resources },
      enemyTowers,
      combatActions,
      diplomacy,
    } = request as any;

    const targetId = enemyTowers[0].playerId;

    return { 'type': 'attack', 'targetId': targetId, 'troopCount': resources };
  }
}
