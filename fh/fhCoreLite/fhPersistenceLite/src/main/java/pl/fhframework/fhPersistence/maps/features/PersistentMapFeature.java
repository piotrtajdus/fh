package pl.fhframework.fhPersistence.maps.features;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.PropertyAccessor;
import org.springframework.beans.PropertyAccessorFactory;
import pl.fhframework.ReflectionUtils;
import pl.fhframework.core.generator.ModelElement;
import pl.fhframework.core.generator.ModelElementType;
import pl.fhframework.core.maps.features.IFeature;
import pl.fhframework.core.maps.features.geometry.*;
import pl.fhframework.fhPersistence.core.BasePersistentObject;

import javax.persistence.Transient;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public abstract class PersistentMapFeature extends BasePersistentObject implements IFeature {
    @Transient
    protected String clientId;

    private static AtomicInteger counter = new AtomicInteger(0);

    public PersistentMapFeature() {
        this.clientId = String.valueOf(counter.incrementAndGet());
    }

    @Override
    @ModelElement(type = ModelElementType.HIDDEN)
    public String getClientId() {
        return this.clientId;
    }

    @Override
    public List<Class<? extends IGeometry>> allowedGeometries() {
        return Arrays.asList(IPoint.class, ILineString.class, IPolygon.class, IMultiPoint.class, IMultiLineString.class, IMultiPolygon.class);
    }

    @Override
    public Map<String, Object> getProperties() {
        PropertyAccessor propertyAccessor = PropertyAccessorFactory.forBeanPropertyAccess(this);
        return ReflectionUtils.getFields(this.getClass(), JsonProperty.class).stream().collect(Collectors.toMap(
                field -> {
                    JsonProperty jsonProperty = field.getAnnotation(JsonProperty.class);
                    return jsonProperty.value();
                }, field -> propertyAccessor.getPropertyValue(field.getName())));
    }
}
