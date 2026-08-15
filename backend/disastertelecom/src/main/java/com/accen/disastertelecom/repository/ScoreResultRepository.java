package com.accen.disastertelecom.repository;

import com.accen.disastertelecom.entity.ScoreResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreResultRepository extends JpaRepository<ScoreResult, String> {
    List<ScoreResult> findBySeverity(String severity);
    List<ScoreResult> findAllByOrderByPriorityScoreDesc();
}