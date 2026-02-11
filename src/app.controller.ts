import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

const calculateUpToNextLevel = (currentLevel: number): number => {
  return Math.ceil(50 * Math.pow(1.75, currentLevel - 1));
}

const calculateExpectedIncome = (currentLevel: number): number => {
  return Math.ceil(20 * Math.pow(1.5, currentLevel - 1));
}

const calculateArmorAddition = (currentLevel: number): number => {
  return Math.ceil(5 * Math.pow(1.75, currentLevel - 1));
}

const calculateAttackTroops = (currentLevel: number): number => {
  return Math.ceil(5 * Math.pow(1.75, currentLevel - 1));
}

const upgradePrices = [50, 88, 153, 268, 469];

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
    console.log(request);

    const {
      playerTower: { playerId, hp, armor, resources },
      enemyTowers,
      combatActions,
    } = request.body as any;

    const allyMessages: any[] = [];

    enemyTowers.forEach((enemy) => {
      allyMessages.push({ allyId: enemy.playerId })
    });

    enemyTowers.toReversed().forEach((enemy, i) => {
      allyMessages[i].attackTargetId = enemy.playerId;
    })

    return allyMessages;
  }

  @Post('combat')
  combat(@Req() request: Request) {
    const {
      turn,
      playerTower: { playerId, hp, armor, resources, level },
      enemyTowers,
      combatActions,
      diplomacy,
    } = request.body as any;

    let availableResources = resources;

    const nextLevelPrice = upgradePrices[level-1];
    const expectedIncome = calculateExpectedIncome(level);

    const actions: any[] = [];

    if (level >= 5) {
      actions.push({ "type": "armor", "amount": resources });

      return actions;
    }

    if (availableResources >= nextLevelPrice) {
      actions.push({ "type": "upgrade" });
      availableResources -= nextLevelPrice;
    }

    const armorAddition = (nextLevelPrice - availableResources) % expectedIncome;

    if (armorAddition != 0) {
      actions.push({ "type": "armor", "amount": armorAddition });
      availableResources -= armorAddition;
    }

    return actions;
  }
}
