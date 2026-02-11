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
      playerTower: { playerId, hp, armor, resources, level },
      enemyTowers,
      combatActions,
      diplomacy,
    } = request.body as any;

    const targetId = enemyTowers[0].playerId;

    // diplomacy.forEach(() => {
    //
    // });
    //
    // enemyTowers.forEach((enemy) => {
    //
    // });

    let availableResources = resources;

    const actions: any[] = [];

    const neededToUp = calculateUpToNextLevel(level);
    if (availableResources >= neededToUp) {
      actions.push({ "type": "upgrade" });
      availableResources -= neededToUp;
    }

    const armorAddition = calculateArmorAddition(level);
    if (availableResources >= armorAddition) {
      actions.push({ "type": "armor", "amount": armorAddition });
      availableResources -= armorAddition;
    }

    const attackTroops = calculateAttackTroops(level);

    if (availableResources >= attackTroops) {
      actions.push({ "type": "attack", "targetId": targetId, "troopCount": attackTroops });
      availableResources -= attackTroops;
    }

    return actions;

    // Response
    // [
    //   { "type": "armor", "amount": 5 },
    //   { "type": "attack", "targetId": 102, "troopCount": 20 },
    //   { "type": "upgrade" }
    // ]
  }
}
