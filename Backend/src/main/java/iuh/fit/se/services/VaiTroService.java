package iuh.fit.se.services;

import iuh.fit.se.entities.VaiTro;

public interface VaiTroService {
    VaiTro findByIdRaw(int id);
    VaiTro findByTenVaiTroRaw(String tenVaiTro);
}
