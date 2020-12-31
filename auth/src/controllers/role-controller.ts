import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@tts-dev/common';
import { roleService } from '../services/role-service';

const getRoles = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;
  const { success, errors, paginatedRoles } = await roleService.getRoles({
    search: search?.toString(),
    page: page ? parseInt(page.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  });
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(paginatedRoles);
};

const getRole = async (req: Request, res: Response) => {
  const { id } = await req.params;
  const { success, role } = await roleService.getRole(id);
  if (!success) {
    throw new NotFoundError('Role not found');
  }

  res.status(200).send(role);
};

const createRole = async (req: Request, res: Response) => {
  const { name, resources, policy } = req.body;
  const { success, errors, role } = await roleService.createRole({
    name,
    resources,
    policy,
  });
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(201).send(role);
};

const updateRole = async (req: Request, res: Response) => {
  const { name, resources, policy } = req.body;
  const { id } = req.params;
  const { success, errors, role } = await roleService.updateRole(id, {
    name,
    resources,
    policy,
  });
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(role);
};

const deleteRoles = async (req: Request, res: Response) => {
  const { ids } = req.body;
  const { success, errors, roles } = await roleService.deleteRoles(ids);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(roles);
};

const approveRoles = async (req: Request, res: Response) => {
  const { ids } = req.body;
  const { success, errors, roles } = await roleService.approveRoles(ids);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(roles);
};

const roleController = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRoles,
  approveRoles,
};

export { roleController };
