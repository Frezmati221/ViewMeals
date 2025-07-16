import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { IconRepository } from "./icon.repository";
import { Icon } from "../database";

@Injectable()
export class IconService {
  constructor(private iconRepository: IconRepository) {}

  async create(createIconDto: any): Promise<Icon> {
    // Check if icon with this label already exists
    const existingIcon = await this.iconRepository.findByLabel(
      createIconDto.label
    );
    if (existingIcon) {
      throw new BadRequestException("Icon with this label already exists");
    }

    return await this.iconRepository.create(createIconDto);
  }

  async findAll(query: any): Promise<{
    icons: Icon[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.label = { $regex: search, $options: "i" };
    }

    const icons = await this.iconRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
    });

    const total = await this.iconRepository.countDocuments(filter);

    return {
      icons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Icon> {
    const icon = await this.iconRepository.findById(id);
    if (!icon) {
      throw new NotFoundException("Icon not found");
    }
    return icon;
  }

  async update(id: string, updateIconDto: any, user: any): Promise<Icon> {
    const icon = await this.iconRepository.findById(id);
    if (!icon) {
      throw new NotFoundException("Icon not found");
    }

    const { label, svg } = updateIconDto;

    // Check if label is being updated and if it already exists
    if (label && label !== icon.label) {
      const existingIcon = await this.iconRepository.findByLabel(label, id);
      if (existingIcon) {
        throw new BadRequestException("Icon with this label already exists");
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (label !== undefined) {
      updateData.label = label;
    }
    if (svg !== undefined) {
      updateData.svg = svg;
    }

    const updatedIcon = await this.iconRepository.update(id, updateData);
    if (!updatedIcon) {
      throw new NotFoundException("Icon not found");
    }

    return updatedIcon;
  }

  async remove(id: string): Promise<{ message: string }> {
    const icon = await this.iconRepository.findById(id);
    if (!icon) {
      throw new NotFoundException("Icon not found");
    }

    await this.iconRepository.delete(id);
    return { message: "Icon deleted successfully" };
  }
}
