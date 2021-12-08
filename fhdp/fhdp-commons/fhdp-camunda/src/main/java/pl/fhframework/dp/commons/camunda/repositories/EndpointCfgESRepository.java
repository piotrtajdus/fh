package pl.fhframework.dp.commons.camunda.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import pl.fhframework.dp.transport.endpoints.EndpointCfgDto;

import java.util.Optional;


/**
 * @author <a href="mailto:jacek_borowiec@skg.pl">Jacek Borowiec</a>
 * @version $Revision:  $, $Date:  $
 * @created 2019-02-15
 */
public interface EndpointCfgESRepository extends ElasticsearchRepository<EndpointCfgDto, String> {
    Optional<EndpointCfgDto> getBySystemNameAndServiceName(String systemName, String serviceName);

}
